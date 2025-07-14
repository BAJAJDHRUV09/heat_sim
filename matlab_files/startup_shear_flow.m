% clear; clc; close all;
% 
% % Fluid properties: {name, kinematic viscosity [m^2/s]}
% fluids = {
%     'Mercury', 1.2e-7;
%     'Water',   1.0e-6;
%     'Air',     1.5e-5;
%     'Honey',   1.0e-3;
% };
% 
% U = 1;           % Bottom plate velocity
% d = 1;           % Plate spacing
% Ny = 200;        % y-resolution
% y = linspace(0, d, Ny)';  % Column vector
% N_modes = 200;   % Fourier terms
% 
% % Time settings
% t_vals = logspace(2,4,10);  
% % Output folder
% out_dir = 'startup_startup_flow';
% if ~exist(out_dir, 'dir'), mkdir(out_dir); end
% 
% % Loop over fluids
% for f = 1:size(fluids,1)
%     name = fluids{f,1};
%     nu   = fluids{f,2};
% 
%     for k = 1:length(t_vals)
%         t = t_vals(k);
% 
%         % Series solution
%         u = U * (1 - y/d);  % steady profile
% 
%         for n = 0:N_modes
%             lambda_n = (2*n + 1)*pi / (2*d);
%             term = (4*U / (pi * (2*n + 1))) * sin(lambda_n * y) .* exp(-nu * lambda_n^2 * t);
%             u = u - term;  % Subtract the transient part
%         end
%         u = U * (1 - (4/pi) * u);  % Final profile
% 
%         % Plot
%         fig = figure('Visible','off');
%         plot(u/U, y/d, 'r-', 'LineWidth', 2);
%         xlabel('u / U', 'FontSize', 12);
%         ylabel('y / d', 'FontSize', 12);
%         t_star = nu * t / d^2;
%         title(sprintf('%s | \\nu = %a.1e | t = %.1f s | t^* = %.4f', ...
%             name, nu, t, t_star), ...
%             'FontSize', 13, 'FontWeight', 'bold');
%         grid on; xlim([0 1.02]); ylim([0 1])
%         set(gca, 'FontSize', 11); set(gcf, 'Color', 'w');
% 
%         % Save
%         fname = sprintf('%s/%s_t%.1fs_tstar%.4f.png', out_dir, name, t, t_star);
%         saveas(fig, fname);
%         close(fig);
%     end
% end
% 
% disp('Fourier-based velocity evolution plots saved for all fluids.');


% 
% clear; clc; close all;
% 
% % Fluid properties: {name, kinematic viscosity [m^2/s]}
% fluids = {
%     'Mercury', 1.2e-7;
%     'Water',   1.0e-6;
%     'Air',     1.5e-5;
%     'Honey',   1.0e-3;
% };
% 
% U = 1;            % Bottom plate velocity
% d = 1;            % Plate spacing
% Ny = 300;         % y-resolution
% y = linspace(0, d, Ny)';     % Spatial grid
% y_bar = y / d;                % Non-dimensional y
% N_modes = 200;                % Fourier terms
% 
% %  Now use dimensionless time w.r.t fluid’s own timescale
% t_ratio_vals = logspace(-3, 1, 15);  % t / tc = t * nu / d^2 = t_star
% 
% for f = 1:size(fluids,1)
%     name = fluids{f,1};
%     nu   = fluids{f,2};
% 
%     tc = d^2 / nu;  % characteristic viscous diffusion time
% 
%     % Create output folder
%     out_dir = fullfile('shear_flow_scaled_time', name);
%     if ~exist(out_dir, 'dir'), mkdir(out_dir); end
% 
%     for k = 1:length(t_ratio_vals)
%         t_ratio = t_ratio_vals(k);  % t / tc
%         t = t_ratio * tc;           % dimensional time
%         t_star = nu * t / d^2;      % this will just be equal to t_ratio (sanity check)
% 
%         % Series solution
%         u = U * (1 - y/d);  % steady state profile
%         for n = 0:N_modes
%             lambda_n = (2*n + 1) * pi / (2*d);
%             A_n = (4 * U) / (pi * (2*n + 1));
%             u = u - A_n * sin(lambda_n * y) .* exp(-lambda_n^2 * t_star);
%         end
%         u_bar = u / U;
% 
%         % Plot
%         fig = figure('Visible','off');
%         plot(u_bar, y_bar, 'r-', 'LineWidth', 2);
%         xlabel('\itu̅ = u / U', 'FontSize', 12);
%         ylabel('\ity̅ = y / d', 'FontSize', 12);
%         title(sprintf('%s | t/\\itt_c = %.4f | t = %.4fs', name, t_ratio, t), ...
%             'FontSize', 13, 'FontWeight', 'bold');
%         grid on; xlim([0 1.05]); ylim([0 1]);
%         set(gca, 'FontSize', 11); set(gcf, 'Color', 'w');
% 
%         % Save
%         fname = sprintf('%s/%s_frame%02d_tratio%.4f.png', out_dir, name, k, t_ratio);
%         saveas(fig, fname);
%         close(fig);
%     end
% end
% 
% disp(' Shear flow plots saved for all fluids with scaled time (t/tc).');


clear; clc; close all;

% Fluid properties: {name, kinematic viscosity [m^2/s]}
fluids = {
    'Mercury', 1.2e-7;
    'Water',   1.0e-6;
    'Air',     1.5e-5;
    'Honey',   1.0e-3;
};

U = 1;             % Bottom plate velocity
d = 1;             % Plate spacing
Ny = 300;          % y-resolution
y = linspace(0, d, Ny)';     % Spatial grid
y_bar = y / d;                % Non-dimensional y
N_modes = 200;                % Fourier terms

t_vals = logspace(1, 6, 15);  % From 0.001s to 10s

% Create output base folder
out_dir = 'shear_flow_fixed_physical_time_corrected';
if ~exist(out_dir, 'dir'), mkdir(out_dir); end

% Loop through each fixed PHYSICAL time
for k = 1:length(t_vals)
    t = t_vals(k);  % physical time in seconds

    % Create a subfolder for this time
    t_folder = sprintf('%s/t_%.4fs', out_dir, t);
    if ~exist(t_folder, 'dir'), mkdir(t_folder); end

    % Now compute velocity for each fluid at this same physical time
    for f = 1:size(fluids,1)
        name = fluids{f,1};
        nu   = fluids{f,2};

        % Correct Fourier series solution (satisfying BCs at y=0 and y=d)
        u = zeros(size(y));
        for n = 0:N_modes
            lambda_n = (2*n + 1) * pi / (2*d);
            A_n = (4 * U) / (pi * (2*n + 1));
            u = u + A_n * sin(lambda_n * y) .* exp(-nu * lambda_n^2 * t);
        end

        % Final profile
        u = U * (1 - y/d) - u;
        u_bar = u / U;

        % Plot
        fig = figure('Visible','off');
        plot(u_bar, y_bar, 'r-', 'LineWidth', 2);
        xlabel('\itu̅ = u / U', 'FontSize', 12);
        ylabel('\ity̅ = y / d', 'FontSize', 12);
        title(sprintf('%s | t = %.4fs', name, t), ...
            'FontSize', 13, 'FontWeight', 'bold');
        grid on; xlim([0 1.05]); ylim([0 1]);
        set(gca, 'FontSize', 11); set(gcf, 'Color', 'w');

        % Save
        fname = sprintf('%s/%s_t%.4fs.png', t_folder, name, t);
        saveas(fig, fname);
        close(fig);
    end
end

disp('Correct shear flow profiles saved at fixed physical times (with BCs enforced).');
