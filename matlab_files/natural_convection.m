clc; clear; close all;

% --- Common Physical Parameters ---
T_s = 100;     % Surface temperature (°C)
T_inf = 25;    % Ambient temperature (°C)
x_pos = 4.5;   % Height of the vertical plate (m)

g = 9.81;      % Gravity (m/s^2)
beta = 1 / (T_inf + 273.15); % Thermal expansion coefficient (1/K)
nu = 1.5e-5;   % Kinematic viscosity (m^2/s)

% --- Define Fluids (Prandtl Numbers) ---
Prandtl_numbers = [0.7, 1, 10];  % Liquid metals, air, benchmark, oil
fluid_names = {'Air_Pr0.7', 'Benchmark_Pr1', 'Oil_Pr10'};

% --- Fixed Locations for Profiles ---
x_vel_locations = [0.8, 2.8];
x_temp_locations = [1.8, 3.8];

% --- Save folder ---
output_folder = 'natural_convection2';
if ~exist(output_folder, 'dir')
    mkdir(output_folder);
end

for f = 1:length(Prandtl_numbers)
    Pr = Prandtl_numbers(f);
    alpha = nu / Pr;  % Thermal diffusivity
    
    % Meshgrid
    [y_grid, x_grid] = meshgrid(linspace(0, 0.15, 150), linspace(0.01, x_pos, 300));
    u_field = zeros(size(x_grid));

    for i = 1:size(x_grid, 1)
        x_curr = x_grid(i, 1);
        Gr = g * beta * (T_s - T_inf) * x_curr^3 / nu^2;
        Ra = Gr * Pr;
        delta_u = 5 * x_curr / (Ra^(1/4));
        U_char = g * beta * (T_s - T_inf) * x_curr^2 / (nu * sqrt(Ra));
        
        for j = 1:size(y_grid, 2)
            y_curr = y_grid(1, j);
            eta = y_curr / delta_u;
            if eta >= 0 && eta <= 1
                u_field(i, j) = U_char * eta * (1 - eta)^2;
            end
        end
    end

    u_norm = u_field / max(u_field(:));
    
    % --- Plotting ---
    figure('Position', [100 100 600 600]); hold on;
    contourf(y_grid, x_grid, u_norm, 30, 'LineStyle', 'none');
    colormap("cool");
    cb = colorbar('eastoutside');
    cb.Label.String = 'Normalized Velocity Magnitude';
    cb.FontSize = 10;
    cb.Label.FontSize = 11;
    cb.Ticks = linspace(0, 1, 5);
    cb.TickLabels = arrayfun(@(x) sprintf('%.2f', x), cb.Ticks, 'UniformOutput', false);
    
    plot([0 0], [0 x_pos], 'k', 'LineWidth', 3);
    
    % Velocity Profiles
    for x_loc = x_vel_locations
        Gr = g * beta * (T_s - T_inf) * x_loc^3 / nu^2;
        Ra = Gr * Pr;
        delta_u = 6 * x_loc / (Ra^(1/4));
        U_char = sqrt(g * beta * (T_s - T_inf) * x_loc);
        
        y_vals = linspace(0, delta_u, 100);
        eta = y_vals / delta_u;
        u_vals = U_char * eta .* (1 - eta).^3;
        u_norm = u_vals / max(u_vals);
        scale_factor = 0.4 * x_loc;
        
        plot(y_vals, x_loc + scale_factor * u_norm, 'b', 'LineWidth', 2.5);
        idxs = round(linspace(1, length(y_vals), 12));
        for i = 1:length(idxs)
            y_line = y_vals(idxs(i));
            u_val = u_norm(idxs(i));
            if u_val > 0.05
                line([y_line y_line], [x_loc x_loc + scale_factor * u_val], ...
                    'Color', 'b', 'LineWidth', 1.5);
            end
        end
    end
    
    % Temperature Profiles
    for x_loc = x_temp_locations
        Gr = g * beta * (T_s - T_inf) * x_loc^3 / nu^2;
        Ra = Gr * Pr;
        delta_u = 6 * x_loc / (Ra^(1/4));
        delta_T = delta_u / (Pr^(1/3));
        
        y_vals = linspace(0, delta_T, 100);
        T_vals = (1 - y_vals / delta_T).^2;
        scale_factor = 0.6;
        
        plot(y_vals, x_loc + scale_factor * T_vals, 'k-.', 'LineWidth', 2.5);
        idxs = round(linspace(1, length(y_vals), 10));
        for i = 1:length(idxs)
            y_line = y_vals(idxs(i));
            T_val = T_vals(idxs(i));
            if T_val > 0.02
                line([y_line y_line], [x_loc x_loc + scale_factor * T_val], ...
    'Color', 'k', 'LineWidth', 1.8, 'LineStyle', '-.');
            end
        end
    end
    
    % Boundary Layers
    x_BL = linspace(0.01, x_pos, 200);
    Gr_BL = g * beta * (T_s - T_inf) * x_BL.^3 / nu^2;
    Ra_BL = Gr_BL * Pr;
    delta_u_BL = 6 * x_BL ./ (Ra_BL.^(1/4));
    delta_T_BL = delta_u_BL / (Pr^(1/3));
    
    plot(delta_u_BL, x_BL, 'b-', 'LineWidth', 2.5);
    plot(delta_T_BL, x_BL, 'k--', 'LineWidth', 2.5);
    
    % Formatting
    xlim([0, 0.035]);
    ylim([0, x_pos]);
    pbaspect([1 1 1]);
    
    h_vel = plot(NaN, NaN, 'b-', 'LineWidth', 2.5);
    h_temp = plot(NaN, NaN, 'k--', 'LineWidth', 2.5);
    legend([h_vel, h_temp], {'Velocity Profile & BL', 'Temperature Profile & BL'}, ...
        'Location', 'southeast', 'FontSize', 11);

    title(['Natural Convection, Pr = ', num2str(Pr)]);
    
    % Save figure
    saveas(gcf, fullfile(output_folder, [fluid_names{f}, '.png']));
    close(gcf);
end
