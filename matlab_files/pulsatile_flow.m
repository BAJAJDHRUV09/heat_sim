% clc; clear; close all;
% 
% % User settings
% num_snapshots = 10;         % Number of time points
% f = 2;                      % Hz
% omega = 2 * pi * f;
% T = 1 / f;
% 
% % Physical parameter sets
% densities = [1.2, 1000, 13500];          
% viscosities = [1e-5, 1e-3, 1];             
% R = 0.005;                                   % Fixed pipe radius (5 mm)
% 
% % Output folder
% root_folder = 'snapshots';
% if ~exist(root_folder, 'dir'); mkdir(root_folder); end
% 
% % Grid
% Nr = 200;
% r_bar = linspace(-1, 1, Nr);
% t_vals = linspace(0, T, num_snapshots);
% 
% % Loop
% case_num = 0;
% for rho = densities
%     for mu = viscosities
%         case_num = case_num + 1;
% 
%         R_omega = rho * omega * R^2 / mu;
%         Wo = sqrt(R_omega);
%         alpha = sqrt(R_omega / 1i);
% 
%         J0_alpha = besselj(0, alpha);
%         J0_profile = besselj(0, alpha * abs(r_bar)) / J0_alpha;
% 
%         folder_name = sprintf('%s/case_%02d_rho=%.0f_mu=%.0e_Wo=%.2f', ...
%             root_folder, case_num, rho, mu, Wo);
%         mkdir(folder_name);
% 
%         for k = 1:num_snapshots
%             t = t_vals(k);
%             t_bar = omega * t;
% 
%             u_complex = (-1i * exp(1i * t_bar) / R_omega) * (1 - J0_profile);
%             u_real = imag(u_complex);
%             u_real = u_real / max(abs(u_real));  % Normalize
% 
%             fig = figure('Visible', 'off');
%             plot(r_bar, u_real, 'b-', 'LineWidth', 2);
%             xlabel('r / R'); ylabel('u / max(u)');
%             title(sprintf('t = %.3fs, Wo = %.2f', t, Wo));
%             xlim([-1 1]); ylim([-1.1 1.1]); grid on;
% 
%             saveas(fig, sprintf('%s/snapshot_%02d_t=%.3fs.png', folder_name, k, t));
%             close(fig);
%         end
%     end
% end
% 
% disp('✅ All 9 contrasting Womersley flow cases simulated.');


clc; clear; close all;

% User settings
num_snapshots = 15;         % Increased snapshots
f = 2;                      % Hz
omega = 2 * pi * f;
T = 1 / f;

% Define 3 fluids with (density, viscosity)
fluids = {
    'Air',     1.2,     1e-5;
    'Water',   1000,    1e-3;
    'Mercury', 13500,   1
};

% Output folder
root_folder = 'snapshots2';
if ~exist(root_folder, 'dir'); mkdir(root_folder); end

% Grid
Nr = 200;
r_bar = linspace(-1, 1, Nr);
t_vals = linspace(0, T, num_snapshots + 1); 
t_vals(end) = [];  % Avoid overlap of t=0 and t=T

% Loop over 3 fluids
for i = 1:size(fluids, 1)
    fluid_name = fluids{i, 1};
    rho = fluids{i, 2};
    mu = fluids{i, 3};

    R = 0.005;  % 5 mm radius
    R_omega = rho * omega * R^2 / mu;
    Wo = sqrt(R_omega);
    alpha = sqrt(R_omega / 1i);

    J0_alpha = besselj(0, alpha);
    J0_profile = besselj(0, alpha * abs(r_bar)) / J0_alpha;

    folder_name = sprintf('%s/%02d_%s_rho=%.0f_mu=%.0e_Wo=%.2f', ...
        root_folder, i, fluid_name, rho, mu, Wo);
    mkdir(folder_name);

    for k = 1:num_snapshots
        t = t_vals(k);
        t_bar = omega * t;

        u_complex = (-1i * exp(1i * t_bar) / R_omega) * (1 - J0_profile);
        u_real = imag(u_complex);
        u_real = u_real / max(abs(u_real));  % Normalize

        fig = figure('Visible', 'off');
        plot(r_bar, u_real, 'b-', 'LineWidth', 2);
        xlabel('r / R'); ylabel('u / max(u)');
        title(sprintf('%s | t = %.3fs | Wo = %.2f', fluid_name, t, Wo));
        xlim([-1 1]); ylim([-1.1 1.1]); grid on;

        saveas(fig, sprintf('%s/snapshot_%02d_t=%.3fs.png', folder_name, k, t));
        close(fig);
    end
end

disp('✅ 3 fluid cases simulated with 15 smooth snapshots each.');
